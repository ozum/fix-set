<!-- DO NOT EDIT README.md (It will be overridden by README.hbs) -->

# fix-set

Lets you define prefix and suffix rules to test strings against.

# Description

`fix-set` module lets you define simple prefix, suffix and exception rules and test strings against those rules.

Possible use cases:

* Filter query parameters from a web form.
* Filter custom HTTP header fields.

## Rule Priority

* Rules: `exclude` > `include`
* Inside Rules: `except` > `elements` > `exceptPrefixes` or `exceptSuffixes` > `prefixes` or `suffixes`
* Prefixes and suffixes has `or` relation. If a string satisfies one of them, rule is satisfied.
* If no `prefixes` and `suffixes` provided, it is assumed all strings are included in rule except `exceptPrefixes` and `exceptSuffixes`.

# Synopsis
```js
import FixSet from 'fix-set';
import type { FixSetConfig, FixSetRuleConfig } from 'fix-set';  // Flow only
```

--------------

```js
// Whitelist: Include only strings starting with 'q' but not 'qX'.
const fixSet = new FixSet({
  include: {
    prefixes:       'q',
    exceptPrefixes: 'qX',
    replacePrefix:  true,
    replaceSuffix:  true
  }
});

const name       = fixSet.getName('qMemberName');   // 'MemberName'
const has        = fixSet.has('qMemberName');       // true
const otherField = fixSet.getName('qxOther');       // undefined
const otherHas   = fixSet.has('qxOther');           // false
```

```js
// Blacklist: Include all strings excluding which begins with 'q',
// but include strings beginning with 'qX' even they also begin with 'q'.
const fixSet = new FixSet({
  exclude: {
    prefixes:       'q',
    exceptPrefixes: 'qX',
    replacePrefix:  true,
    replaceSuffix:  true
  }
});

const name       = fixSet.getName('qMemberName');   // undefined
const has        = fixSet.has('qMemberName');       // false
const otherField = fixSet.getName('qxOther');       // Other
const otherHas   = fixSet.has('qxOther');           // true
```

```js
  // Usage with Array#filter, Array#map etc.
  // Get included field names.
  const parameters = Object.keys(formParameters).filter(param => fixSet.has(param));
  const dbFields   = Object.keys(formParameters)
    .map(param => fixSet.getName(param))
    .filter(field => field !== undefined);
```

```js
// Usage with lodash.
import lodash from 'lodash';
const filteredObject = lodash.pickBy(data, (value, key) => fixSet.has(key));
```

```js
// Cover only strings starting with 'q' or /^=(.+?)=/.
const fixSet = new FixSet({
  include: {
    prefixes:      ['q', /^=(.+?)=/],
    replacePrefix: true,
    replaceSuffix: true
  }
});
const name = fixSet.getName('qMemberName');     // 'MemberName'
const has  = fixSet.has('qMemberName');         // true
const has  = fixSet.has('=eq=MemberName');      // true
const has  = fixSet.getName('=eq=MemberName');  // 'MemberName'
```

## Why both `include` and `exclude`?

Consider two scenarios below:

* Include all strings, but not starting with 'q'. However include starting with 'qx': `{ exclude: { prefixes: 'q', exceptPrefixes: 'qx' } }`
* Exclude all strings, but not starting with 'q'. However exclude starting with 'qx' `{ include: { prefixes: 'q', exceptPrefixes: 'qx' } }`

# API
## Classes

<dl>
<dt><a href="#FixSet">FixSet</a></dt>
<dd><p>Class representing a filter rule. A rule consists of prefixes, elements and disallowed elements etc. Later individual elements
can be tested if they are covered by this rule.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#FixSetRuleConfig">FixSetRuleConfig</a> : <code>Object</code></dt>
<dd><p>Fix rule options to create a fix rule from given options. Prefix and suffix parameters can be either string
or regular expression. If they are provided as regular expressions, they must begin with <code>^</code> or end with <code>$</code>.
If no <code>prefixes</code> and <code>suffixes</code> provided, it is assumed all strings are included except <code>exceptPrefixes</code>
and <code>exceptSuffixes</code>.</p>
</dd>
<dt><a href="#FixSetConfig">FixSetConfig</a> : <code>Object</code></dt>
<dd><p>Fix rule configuration.</p>
</dd>
</dl>

<a name="FixSet"></a>

## FixSet
Class representing a filter rule. A rule consists of prefixes, elements and disallowed elements etc. Later individual elements
can be tested if they are covered by this rule.

**Kind**: global class  

* [FixSet](#FixSet)
    * [new FixSet([config])](#new_FixSet_new)
    * [.getName(element, [options])](#FixSet+getName) ⇒ <code>string</code> \| <code>undefined</code>
    * [.has(element)](#FixSet+has) ⇒ <code>boolean</code>

<a name="new_FixSet_new"></a>

### new FixSet([config])
Creates FixSet object. If no `include` or `exclude` parameters provided or empty configurations are provided, they
would be skipped.


| Param | Type | Description |
| --- | --- | --- |
| [config] | <code>Object</code> | Configuration. |
| [config.include] | [<code>FixSetRuleConfig</code>](#FixSetRuleConfig) | Inclusion rule configuration. |
| [config.exclude] | [<code>FixSetRuleConfig</code>](#FixSetRuleConfig) | Exclusion rule configuration. |

<a name="FixSet+getName"></a>

### fixSet.getName(element, [options]) ⇒ <code>string</code> \| <code>undefined</code>
Returns element name if it is covered by rule. Returns undefined otherwise. Prefix and suffix in element name
is replaced if requested by rule.

**Kind**: instance method of [<code>FixSet</code>](#FixSet)  
**Returns**: <code>string</code> \| <code>undefined</code> - - Element name if it is covered by rule, undefined otherwise. Name getName prefix and suffix replaced if requested by rule.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| element | <code>string</code> |  | Element name to test whether it is covered by rule. |
| [options] | <code>Object</code> | <code>{}</code> | Options |
| [options.replacePrefix] | <code>boolean</code> \| <code>undefined</code> |  | Whether it should prefix be stripped from start of field name. Defaults to value given during object cunstruction. |
| [options.replaceSuffix] | <code>boolean</code> \| <code>undefined</code> |  | Whether it should suffix be stripped from end of field name. Defaults to value given during object cunstruction. |

<a name="FixSet+has"></a>

### fixSet.has(element) ⇒ <code>boolean</code>
Returns whether element is covered by rules.

**Kind**: instance method of [<code>FixSet</code>](#FixSet)  
**Returns**: <code>boolean</code> - - Whether element is covered by rule.  

| Param | Type | Description |
| --- | --- | --- |
| element | <code>string</code> | Element name to test. |

<a name="FixSetRuleConfig"></a>

## FixSetRuleConfig : <code>Object</code>
Fix rule options to create a fix rule from given options. Prefix and suffix parameters can be either string
or regular expression. If they are provided as regular expressions, they must begin with `^` or end with `$`.
If no `prefixes` and `suffixes` provided, it is assumed all strings are included except `exceptPrefixes`
and `exceptSuffixes`.

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| element | <code>string</code> \| <code>Array.&lt;string&gt;</code> \| <code>Set.&lt;string&gt;</code> | Strings which are covered by rule. They are compared by equal operator. |
| except | <code>string</code> \| <code>Array.&lt;string&gt;</code> \| <code>Set.&lt;string&gt;</code> | Fields which are not covered by rule. |
| prefixes | <code>string</code> \| <code>RegExp</code> \| <code>Array.&lt;(string\|RegExp)&gt;</code> \| <code>Set.&lt;(string\|RegExp)&gt;</code> | Strings which starts with given prefixes are covered by rule. |
| suffixes | <code>string</code> \| <code>RegExp</code> \| <code>Array.&lt;(string\|RegExp)&gt;</code> \| <code>Set.&lt;(string\|RegExp)&gt;</code> | Strings which ends with given suffixes are covered by rule. |
| exceptPrefixes | <code>string</code> \| <code>RegExp</code> \| <code>Array.&lt;(string\|RegExp)&gt;</code> \| <code>Set.&lt;(string\|RegExp)&gt;</code> | Strings which starts with given prefixes are NOT covered by rule. |
| exceptSuffixes | <code>string</code> \| <code>RegExp</code> \| <code>Array.&lt;(string\|RegExp)&gt;</code> \| <code>Set.&lt;(string\|RegExp)&gt;</code> | Strings which ends with given suffixes are NOT covered by rule. |
| replacePrefix | <code>boolean</code> | Whether it should prefix be stripped from start of field name |
| replaceSuffix | <code>boolean</code> | Whether it should suffix be stripped from end of field name. |

<a name="FixSetConfig"></a>

## FixSetConfig : <code>Object</code>
Fix rule configuration.

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| include | [<code>FixSetRuleConfig</code>](#FixSetRuleConfig) | Configuration rules for included fields. |
| exclude | [<code>FixSetRuleConfig</code>](#FixSetRuleConfig) | Configuration rules for excluded fields. |

