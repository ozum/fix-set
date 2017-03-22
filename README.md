# fix-set

Lets you define prefix and suffix rules to test strings against.

# Description

`fix-set` module lets you define simple prefix, suffix and exception rules and test strings against those rules.

Possible use cases:

* Filter query parameters from a web form.
* Filter custom HTTP header fields. 

# Synopsis

```js
  // Convert parameter names starting with 'q'
  // to database field names replacing 'q' prefix. 
  const fixSet = new FixSet({
    include: {
      prefixes:       'q',
      exceptPrefixes: 'qX',
      replacePrefix:  true,
      replaceSuffix:  true
    }
  });
  
  // Usage with Array#filter, Array#map etc.
  const parameters = formParameters.filter(param => fixSet.has(param));
  const dbFields   = formParameters
    .map(param => fixSet.getName(param))
    .filter(field => field !== undefined);
```

```js
  // Cover all strings starting with 'q' or 'r'. 
  const fixSet = new FixSet({
    include: {
      prefixes:      ['q', 'r'],
      replacePrefix: true,
      replaceSuffix: true
    }
  });
  const name = fixSet.getName('qMemberName');   // 'MemberName'
  const has  = fixSet.has('qMemberName');       // true
```

```js
  // Cover all strings starting with 'q' but not 'qX' 
  const fixSet = new FixSet({
    include: {
      prefixes:       'q',
      exceptPrefixes: 'qx',
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
  // Cover all strings excluding which start with 'q'.
  // However include strings starting 'qX' even they start with 'q'. 
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

# API

<!--- API BEGIN --->

## Classes

<dl>
<dt><a href="#FixSet">FixSet</a></dt>
<dd><p>Class representing a filter rule. A rule consists of prefixes, elements and disallowed elements etc. Later individual elements
can be tested if they are covered by this rule.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#RuleConfig">RuleConfig</a> : <code>Object</code></dt>
<dd><p>Fix rule options to create a fix rule from given options.</p>
</dd>
</dl>

<a name="FixSet"></a>

## FixSet
Class representing a filter rule. A rule consists of prefixes, elements and disallowed elements etc. Later individual elements
can be tested if they are covered by this rule.

**Kind**: global class  

* [FixSet](#FixSet)
    * [new FixSet([include], [exclude])](#new_FixSet_new)
    * [.getName(element, [options])](#FixSet+getName) ⇒ <code>string</code> \| <code>undefined</code>
    * [.has(element)](#FixSet+has) ⇒ <code>boolean</code>

<a name="new_FixSet_new"></a>

### new FixSet([include], [exclude])
Creates FixSet object.


| Param | Type | Description |
| --- | --- | --- |
| [include] | <code>[RuleConfig](#RuleConfig)</code> | Inclusion rule configuration. |
| [exclude] | <code>[RuleConfig](#RuleConfig)</code> | Exclusion rule configuration. |

<a name="FixSet+getName"></a>

### fixSet.getName(element, [options]) ⇒ <code>string</code> \| <code>undefined</code>
Returns element name if it is covered by rule. Returns undefined otherwise. Prefix and suffix in element name
is replaced if requested by rule.

**Kind**: instance method of <code>[FixSet](#FixSet)</code>  
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

**Kind**: instance method of <code>[FixSet](#FixSet)</code>  
**Returns**: <code>boolean</code> - - Whether element is covered by rule.  

| Param | Type | Description |
| --- | --- | --- |
| element | <code>string</code> | Element name to test. |

<a name="RuleConfig"></a>

## RuleConfig : <code>Object</code>
Fix rule options to create a fix rule from given options.

**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| elements | <code>string</code> \| <code>Array.&lt;string&gt;</code> \| <code>Set.&lt;string&gt;</code> |  | Strings which are covered by rule. They are compared by equal operator. |
| except | <code>string</code> \| <code>Array.&lt;string&gt;</code> \| <code>Set.&lt;string&gt;</code> |  | Fields which are not covered by rule. |
| prefixes | <code>string</code> \| <code>Array.&lt;string&gt;</code> \| <code>Set.&lt;string&gt;</code> |  | Strings which starts with given prefixes are covered by rule. |
| suffixes | <code>string</code> \| <code>Array.&lt;string&gt;</code> \| <code>Set.&lt;string&gt;</code> |  | Strings which ends with given suffixes are covered by rule. |
| exceptPrefixes | <code>string</code> \| <code>Array.&lt;string&gt;</code> \| <code>Set.&lt;string&gt;</code> |  | Strings which starts with given prefixes are NOT covered by rule. |
| exceptSuffixes | <code>string</code> \| <code>Array.&lt;string&gt;</code> \| <code>Set.&lt;string&gt;</code> |  | Strings which ends with given suffixes are NOT covered by rule. |
| stripPrefix | <code>boolean</code> | <code>true</code> | Whether it should prefix be stripped from start of field name |
| stripSuffix | <code>boolean</code> | <code>true</code> | Whether it should suffix be stripped from end of field name. |

<!--- API END --->
